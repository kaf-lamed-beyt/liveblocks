import { ReactNode } from "react";
import styles from "../../styles/BlockTypeSelector.module.css";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { nanoid } from "nanoid";
import { BlockType, CustomElement } from "./types";
import { useSelf } from "./liveblocks.config";

type Props = {
  children: ReactNode;
  onSelect: (block: CustomElement) => void;
};

export default function BlockTypeSelector({ children, onSelect }: Props) {
  const self = useSelf();
  const createdBy = self?.connectionId || 0;

  const groups = [
    {
      label: "Text",
      items: [
        {
          label: "Heading 1",
          description: "Large section heading",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.H1,
              children: [
                {
                  text: "",
                },
              ],
            });
          },
        },
        {
          label: "Heading 2",
          description: "Large section heading",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.H2,
              children: [
                {
                  text: "",
                },
              ],
            });
          },
        },

        {
          label: "Heading 3",
          description: "Large section heading",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.H3,
              children: [
                {
                  text: "",
                },
              ],
            });
          },
        },
        {
          label: "Normal text",
          description: "Plain text",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.Paragraph,
              children: [
                {
                  text: "",
                },
              ],
            });
          },
        },
      ],
    },
    {
      label: "Media",
      items: [
        {
          label: "Image",
          description: "Embed from URL",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.Image,
              url: null,
              alt: null,
              children: [{ text: "" }],
            });
          },
        },
        {
          label: "Video",
          description: "Embed YouTube video",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.Video,
              url: null,
              children: [{ text: "" }],
            });
          },
        },
      ],
    },
    {
      label: "Embeds",
      items: [
        {
          label: "Twitter",
          description: "Embed a Tweet",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.Tweet,
              tweetId: null,
              children: [{ text: "" }],
            });
          },
        },
        {
          label: "CodeSandbox",
          description: "Embed CodeSandbox project",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.CodeSandbox,
              url: null,
              children: [{ text: "" }],
            });
          },
        },
        {
          label: "Figma",
          description: "Embed Figma project",
          onSelect: () => {
            onSelect({
              createdBy,
              id: nanoid(),
              type: BlockType.Figma,
              url: null,
              children: [{ text: "" }],
            });
          },
        },
      ],
    },
  ];

  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {children}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content className={styles.content}>
          {groups.map((group, indexGroup) => {
            return (
              <DropdownMenuPrimitive.Group
                key={indexGroup}
                className={styles.group}
              >
                <DropdownMenuPrimitive.Label className={styles.group_label}>
                  {group.label}
                </DropdownMenuPrimitive.Label>

                {groups[indexGroup].items.map((item, indexItem) => {
                  return (
                    <DropdownMenuPrimitive.DropdownMenuItem
                      className={styles.item}
                      key={indexItem}
                      onSelect={item.onSelect}
                    >
                      <span className={styles.item_label}>{item.label}</span>
                      <span className={styles.item_description}>
                        {item.description}
                      </span>
                    </DropdownMenuPrimitive.DropdownMenuItem>
                  );
                })}
              </DropdownMenuPrimitive.Group>
            );
          })}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
