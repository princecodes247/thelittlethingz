'use server';

import { collections } from "@/db";
import { serializeValues } from "@/lib/utils";
import { isAuth } from "@/middleware/auth";
import { toObjectId } from "monarch-orm";
import { revalidatePath } from "next/cache";

interface CreateValentineInput {
  name: string;
  from?: string;
  message: string;
  phoneNumber?: string;
  customUrl?: string;
}

function formatCustomUrl(url: string): string {
  return url
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '') // Remove special characters except hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');   // Remove leading/trailing hyphens
}

export async function createValentine(data: CreateValentineInput) {
  const authData = await isAuth();
  if (!authData) {
    throw new Error('Unauthorized');
  }
  
  try {
    let customUrl = data.customUrl 
      ? formatCustomUrl(data.customUrl)
      : generateCustomUrl(data.name);

    // Ensure URL is not empty after sanitization
    if (!customUrl) {
      customUrl = generateCustomUrl(data.name);
    }
    
    // Check if custom URL already exists
    const existingValentine = await collections.valentine.findOne({
      customUrl
    });

    if (existingValentine) {
      throw new Error('This URL is already taken');
    }

    console.log({authData})
    const valentine = await collections.valentine.insertOne({
      name: data.name,
      from: data?.from && data?.from.length > 0  ? data?.from : undefined,
      message: data?.message,
      phoneNumber: data.phoneNumber || null,
      customUrl,
      creator: authData?.session?.userId,
    });

    revalidatePath('/dashboard');
    return { success: true, data: serializeValues(valentine) };

  } catch (error) {
    console.error('Create Valentine Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create valentine' 
    };
  }
}

export async function deleteValentine(valentineId: string) {
  try {
    const session = await isAuth();
    if (!session) {
      throw new Error('Unauthorized');
    }

    // Find the valentine and verify ownership
    const valentine = await collections.valentine.findOne({
      _id: toObjectId(valentineId),
      userId: session.userId
    });

    if (!valentine) {
      throw new Error('Valentine not found or unauthorized');
    }

    // Delete the valentine
    await collections.valentine.deleteOne({
      _id: toObjectId(valentineId),
      userId: session.userId
    });

    revalidatePath('/dashboard');
    return { success: true };

  } catch (error) {
    console.error('Delete Valentine Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete valentine' 
    };
  }
}

export async function getValentine(customUrl: string) {
  try {
    const valentine = await collections.valentine.findOne({
      customUrl
    }).populate({
        creator: true
    });

    if (!valentine) {
      throw new Error('Valentine not found');
    }

    // Increment view count
    await collections.valentine.updateOne(
      { _id: valentine._id },
      { $inc: { views: 1 } }
    );


    return { 
      success: true, 
      data: serializeValues(valentine),
    };

  } catch (error) {
    console.error('Get Valentine Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch valentine' 
    };
  }
}
export type GetValentineResponse = Awaited<ReturnType<typeof getValentine>>;

export async function getUserValentines() {
  const authData = await isAuth();
  if (!authData) {
    // throw new Error('Unauthorized');
    return { 
      success: false, 
      data: {
        valentines: [],
        stats: {}
      }
    };
  }
  try {

    const valentines = await collections.valentine.find({
        creator: toObjectId(authData?.session?.userId),
    }).sort({
      createdAt: -1
    });

    const stats = {
      total: valentines.length,
      totalViews: valentines.reduce((sum, v) => sum + (v.views || 0), 0)
    };

    return { 
      success: true, 
      data: {
        valentines: serializeValues(valentines),
        stats
      }
    };

  } catch (error) {
    console.error('Get User Valentines Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch valentines' 
    };
  }
}

export type GetUserValentinesResponse = Awaited<ReturnType<typeof getUserValentines>>;

export async function updateValentineResponse(customUrl: string, response: 'accepted' | 'rejected') {
  try {
    const valentine = await collections.valentine.findOne({
      customUrl
    });

    if (!valentine) {
      throw new Error('Valentine not found');
    }

    await collections.valentine.updateOne(
      { customUrl },
      { 
        $push: { 
          responses: {
            response,
            responseDate: new Date()
          }
        },
        $set: {
          status: response
        }
      }
    );

    return { success: true };

  } catch (error) {
    console.error('Update Valentine Response Error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update response' 
    };
  }
}

function generateCustomUrl(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);
  const random = Math.random().toString(36).slice(2, 6);
  return `${base}-${random}`;
}