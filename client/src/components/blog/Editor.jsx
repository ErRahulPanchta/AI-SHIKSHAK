import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Code from "@editorjs/code";

const Editor = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    instanceRef.current = new EditorJS({
      holder: editorRef.current,
      autofocus: true,
      data: {
        blocks:
          value?.map((block) => {
            switch (block.type) {
              case "heading":
                return {
                  type: "header",
                  data: {
                    text: block.text,
                    level: block.level || 1,
                  },
                };

              case "list":
                return {
                  type: "list",
                  data: {
                    items: block.items || [],
                  },
                };

              case "code":
                return {
                  type: "code",
                  data: {
                    code: block.text || "",
                  },
                };

              default:
                return {
                  type: "paragraph",
                  data: {
                    text: block.text || "",
                  },
                };
            }
          }) || [],
      },
      tools: {
        header: Header,
        list: List,
        code: Code,
      },
      async onChange(api) {
        const data = await api.saver.save();

        const formatted = data.blocks.map((block) => ({
          type: block.type,
          data: block.data, 
        }));

        onChange(formatted);
      },
    });

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div ref={editorRef} />
    </div>
  );
};

export default Editor;
