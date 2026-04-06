import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { validateBeforeCreate } from '../utils/algorithms'
import { getDB } from '../config/mongodb'

const CONVERSATION_COLLECTION_NAME = 'conversations'
const CONVERSATION_SCHEMA = Joi.object({
  conversationId: Joi.string().required(),
  participants: Joi.array()
    .items(
      Joi.object({
        userId: Joi.required(),
        role: Joi.string().valid('user', 'admin').required()
      })
    )
    .required(),
  messages: Joi.array()
    .items(
      Joi.object({
        senderId: Joi.required(),
        content: Joi.string().required(),
        timestamp: Joi.date().timestamp('javascript').default(Date.now),
        isRead: Joi.boolean().default(false),
        isDeleted: Joi.boolean().default(false)
      })
    )
    .default([]),
  lastMessageAt: Joi.date().timestamp('javascript').default(Date.now),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(Date.now)
})

const createNew = async (data: any) => {
  try {
    const validData = await validateBeforeCreate(data, CONVERSATION_SCHEMA)
    const createdConversation = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .insertOne(validData)
    return createdConversation
  } catch (error) {
    throw new Error(error as string)
  }
}

const findOneByConversationId = async (conversationId: string) => {
  try {
    const result = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .findOne({ conversationId })
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findByUserId = async (userId: string) => {
  try {
    const result = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .find({ 'participants.userId': new ObjectId(userId) })
      .sort({ lastMessageAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const findAll = async () => {
  try {
    const result = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .find({})
      .sort({ lastMessageAt: -1 })
      .toArray()
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const addMessage = async (conversationId: string, message: any) => {
  try {
    const result = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { conversationId },
        {
          $push: { messages: message },
          $set: { lastMessageAt: message.timestamp, updatedAt: Date.now() }
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const markMessagesAsRead = async (conversationId: string, userId: string) => {
  try {
    const result = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { conversationId },
        {
          $set: {
            'messages.$[elem].isRead': true,
            updatedAt: Date.now()
          }
        },
        {
          arrayFilters: [{ 'elem.senderId': { $ne: new ObjectId(userId) } }],
          returnDocument: 'after'
        }
      )
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const deleteMessage = async (conversationId: string, messageId: string, userId: string) => {
  try {
    const result = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .findOneAndUpdate(
        { conversationId, 'messages.senderId': new ObjectId(userId), 'messages._id': new ObjectId(messageId) },
        {
          $set: { 'messages.$.isDeleted': true, updatedAt: Date.now() }
        },
        { returnDocument: 'after' }
      )
    return result
  } catch (error) {
    throw new Error(error as string)
  }
}

const getUnreadCountByUser = async (userId: string) => {
  try {
    const conversations = await getDB()
      .collection(CONVERSATION_COLLECTION_NAME)
      .find({ 'participants.userId': new ObjectId(userId) })
      .toArray()

    let unreadCount = 0
    for (const conversation of conversations) {
      for (const message of conversation.messages) {
        if (
          message.senderId.toString() !== userId &&
          !message.isRead &&
          !message.isDeleted
        ) {
          unreadCount++
        }
      }
    }
    return unreadCount
  } catch (error) {
    throw new Error(error as string)
  }
}

export const conversationModel = {
  createNew,
  findOneByConversationId,
  findByUserId,
  findAll,
  addMessage,
  markMessagesAsRead,
  deleteMessage,
  getUnreadCountByUser,
  CONVERSATION_COLLECTION_NAME
}
