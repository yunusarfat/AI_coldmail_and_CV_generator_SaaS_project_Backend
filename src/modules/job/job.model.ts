// import mongoose from "mongoose";
// const jobSchema = new mongoose.Schema(
//     {
//         userId:
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,

//         },
//         title:
//         {
//             type: String,
//             default: "New Campaign",
//             trim: true,


//         },
//         desiredPost: {
//             type: String,
//             required: true,
//         },
//         status:
//         {
//             type: String,
//             enum: ["pending", "processing", "done", "failed"],
//             default: "pending"
//         },

//     },


//     { timestamps: true }

// );
// export const Job = mongoose.model("Job", jobSchema);