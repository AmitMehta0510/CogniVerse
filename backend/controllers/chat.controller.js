import Thread from "../models/Thread.js";
import getOpenAiAPIResponse from "../utils/openai.js";
import { v4 as uuidv4 } from "uuid";

// 🔹 Create or continue a chat
export const createOrContinueChat = async (req, res) => {
  try {
    const { threadId, message } = req.body;
    const userId = req.user._id;

    if (!message) return res.status(400).json({ err: "Message is required" });

    let thread;

    if (!threadId) {
      // New chat
      thread = new Thread({
        user: userId,
        threadId: uuidv4(),
        title: message.substring(0, 30),
        messages: [{ role: "user", content: message }],
      });
    } else {
      // Existing chat
      thread = await Thread.findOne({ threadId, user: userId });
      if (!thread) return res.status(404).json({ err: "Thread not found" });

      thread.messages.push({ role: "user", content: message });
      thread.updatedAt = Date.now();
    }

    // Get assistant reply
    const assistantReply = await getOpenAiAPIResponse(message);
    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = Date.now();

    await thread.save();

    res.json({
      reply: assistantReply,
      threadId: thread.threadId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
};

// 🔹 Get all threads of the logged-in user
export const getUserThreads = async (req, res) => {
  try {
    const threads = await Thread.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("-messages");
    res.json(threads);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch threads" });
  }
};

// 🔹 Get messages of a specific thread
export const getThreadMessages = async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId, user: req.user._id });
    if (!thread) return res.status(404).json({ err: "Thread not found" });
    res.json(thread.messages);
  } catch (err) {
    res.status(500).json({ err: "Failed to fetch messages" });
  }
};

// 🔹 Delete a thread
export const deleteThread = async (req, res) => {
  try {
    const { threadId } = req.params;
    const deleted = await Thread.findOneAndDelete({
      threadId,
      user: req.user._id,
    });
    if (!deleted) return res.status(404).json({ err: "Thread not found" });
    res.json({ success: "Thread deleted successfully" });
  } catch (err) {
    res.status(500).json({ err: "Failed to delete thread" });
  }
};
