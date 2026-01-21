// import {
//     CommentStatus,
//     Post,
//     PostStatus,
//     UserRole,
//   } from "../../../generated/prisma/client";
//   import {
//     PostWhereInput,
//     PostWhereUniqueInput,
//   } from "../../../generated/prisma/models";
//   import { prisma } from "../../lib/prisma";

import type { posts, PostStatus } from "../../../generated/prisma/client";
import type { postsWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

  
  const createPost = async (
    Post: Omit<posts, "id" | "createdAt" | "updatedAt">,
    id: string
  ) => {
    const result = await prisma.posts.create({ data: { ...Post, authId: id } });
    return result;
  };
  const getAllPost = async ({
    search,
    tags,
    isFeatured,
    status,
    authId,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  }: {
    search: string | undefined;
    tags: string[] | [];
    isFeatured: boolean | undefined;
    status: PostStatus | undefined;
    authId: string | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
  }) => {
    const anyConditions: postsWhereInput[] = [];
    if (search) {
      anyConditions.push({
        OR: [
          {
            title: {
              contains: search as string,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        ],
      });
    }
    if (tags && tags.length > 0) {
      console.log("tasg", tags);
  
      anyConditions.push({
        tags: {
          hasSome: tags,
        },
      });
    }
  
    if (typeof isFeatured === "boolean") {
      anyConditions.push({ isFeatured });
    }
    if (status) {
      anyConditions.push({ status });
    }
    if (authId) {
      anyConditions.push({ authId });
    }
    const allPost = await prisma.posts.findMany(
      {
      skip: skip,
      take: limit,
      orderBy:
        sortBy && sortOrder ? { [sortBy]: sortOrder } : { createdAt: "desc" },
      where: { AND: anyConditions },
      include:{
        _count: {
          select: { comments: true },
        },
      }
    }
  );
    const total = await prisma.posts.count({
      where: { AND: anyConditions },
    });
    return {
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
  
      data: allPost,
    };
  };

  const getMyPost=async(authId:string)=>{
  await prisma.user.findUniqueOrThrow({
    where:{id:authId,status:'ACTIVE'}
  })
  const result= await prisma.posts.findMany({
    where:{authId:authId},
    orderBy:{createdAt:'desc'},
    include:{
      _count:{
        select:{
          comments:true
        },
      }
    }
    
  })
  
  return result;
  }
  
  const updatePost=async(postId:number,data:Partial<posts>,authId:string,isAdmin:boolean)=>{
  const postData=await prisma.posts.findUniqueOrThrow({
    where:{id:postId},
    select:{
      id:true,
      authId:true
    }
  });
  if(!isAdmin && (postData?.authId !== authId)){
    throw new Error('You are not the owner/creator of this post');
  }
  if(!isAdmin){
    delete data?.isFeatured;
  }
  return await prisma.posts.update({
    where:{id:postData.id},
    data
  })
  }
  
  const deletePost=async(postId:number,authId:string,isAdmin:boolean)=>{
    const postData=await prisma.posts.findUniqueOrThrow({
      where:{id:postId},
      select:{
        id:true,
        authId:true
      }
    });
    if(!isAdmin && (postData?.authId !== authId)){
      throw new Error('You are not the owner/creator of this post');
    }
    return await prisma.posts.delete({
      where:{id:postId}
    })
  }
  
  
  
  
  export const postService = {
    createPost,
    getAllPost,
    getMyPost,
    updatePost,
    deletePost
  };
  