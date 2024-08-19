import mongoose, { Document, Model, Schema } from "mongoose";
import { UserModelInterface } from "./user.models";

interface commentInterface extends Document {
    user: UserModelInterface;
    question: string;
    questionReplies?: commentInterface[];
}


interface reviewInterface extends Document {
    user: UserModelInterface
    rating: number;
    comment: string;
    commentReplies:object[]
}

interface linkInterface extends Document {
    title: string;
    url: string;
}

interface courseDataInterface extends Document {
    title: string;
    description: string;
    videoUrl: string;
    videoThumbnail?: object;
    videoSection: string;
    videoLength: number;
    videoPlayer: string;
    links: linkInterface[]
    suggestion: string;
    questions: commentInterface[];

}

interface courseInterface extends Document {
    name: string;
    description?: string;
    price: number;
    estimatedPrice?: number;
    thumbnail: object;
    tags: string;
    level: string;
    demoUrl: string;
    benefits: { title: string }[];
    prerequisites: { title: string }[];
    reviews: reviewInterface[];
    courseData: courseDataInterface[];
    ratings?: number;
    purchased?: number;

}


const reviewSchema = new Schema<reviewInterface>({
    user: Object,
    rating: {
        type: Number,
        defaults: 0
    },
    comment: String,
    commentReplies: [Object]
})


const linkSchema = new Schema<linkInterface>({
    title: String,
    url: String
});

const commentSchema = new Schema<commentInterface>({
    user: Object,
    question: String,
    questionReplies: [Object],
})


const courseDataSchema = new Schema<courseDataInterface>({
    videoUrl: String,
    title: String,
    videoSection: String,
    description: String,
    videoLength: Number,
    videoPlayer: String,
    links: [linkSchema],
    suggestion: String,
    questions: [commentSchema]
})


const courseSchema = new Schema<courseInterface>({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    estimatedPrice: {
        type: Number
    },
    thumbnail: {
        public_id: {
            type: String
        },
        url: {
            type: String
        },
    },
    tags: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    demoUrl: {
        type: String,
        required: true
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
        type: Number,
        defaults: 0,
    },
    purchased: {
        type: Number,
        default: 0,
    },
})

const CourseModel: Model<courseInterface> = mongoose.model("Course", courseSchema);

export default CourseModel;