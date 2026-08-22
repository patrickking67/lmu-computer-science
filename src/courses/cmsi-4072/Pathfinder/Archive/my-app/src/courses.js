import React from 'react';
import OpenAI from "openai";
import addUser from App

const openai = new OpenAI();
const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "Recommend me some corses on youtube based on my resume to improve my skills" + addUser.selectedfile}
    ]
});

const courses = () => {
  return <h2>completion.messages</h2>;
};

export default courses;

