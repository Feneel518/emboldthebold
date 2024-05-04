"use client";
import dynamic from "next/dynamic";
import { FC } from "react";
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  description: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

const EditorOutput: FC<EditorOutputProps> = ({ description }) => {
  // @ts-ignore
  return <Output data={description} style={style} className="text-sm" />;
};

export default EditorOutput;
