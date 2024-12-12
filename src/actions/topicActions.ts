"use server";
import { convertDocToObj } from "@/libs/helpers";
import connectMongoDB from "@/libs/mongodb";
import Topic from "@/models/topic";
import { revalidatePath } from "next/cache";
// 1. 토픽 생성: Topic.create()
export async function createTopic(description: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.create({ description });
    revalidatePath("/");
    return { success: true, topic: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 생성에 실패했습니다: ${error}`);
  }
}
// 2. 토픽 수정: Topic.findByIdAndUpdate()
export async function updateTopic(id: string, description: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    if (!doc) throw new Error("토픽을 찾을 수 없습니다");
    revalidatePath("/");
    return { success: true, topic: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 수정에 실패했습니다: ${error}`);
  }
}
// 3. 단일 토픽 조회 (GET) Topic.findById(id)
export async function getTopic(id: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.findById(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다");
    return { success: true, topic: convertDocToObj(doc) };
  } catch (error) {
    throw new Error(`토픽 조회에 실패했습니다: ${error}`);
  }
}
// 4. 모든 토픽 조회 (GET): Topic.find()
export async function getAllTopics() {
  try {
    await connectMongoDB();
    const docs = await Topic.find({}).sort({ createdAt: -1 });
    const topics = docs.map((doc) => convertDocToObj(doc));
    return { success: true, topics };
  } catch (error) {
    throw new Error(`토픽 목록 조회에 실패했습니다: ${error}`);
  }
}
// 5. 토픽 삭제: DELETE: Topic.findByIdAndDelete(id)
export async function deleteTopic(id: string) {
  try {
    await connectMongoDB();
    const doc = await Topic.findByIdAndDelete(id);
    if (!doc) throw new Error("토픽을 찾을 수 없습니다");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    throw new Error(`토픽 삭제에 실패했습니다: ${error}`);
  }
}
