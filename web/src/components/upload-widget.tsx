import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, useCycle } from "motion/react";

import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";

export function UploadWidget() {
  const [open, toggleOpen] = useCycle(false, true);

  return (
    <Collapsible.Root onOpenChange={() => toggleOpen()}>
      <motion.div
        className="bg-zinc-900 w-full overflow-hidden min-w-[360px] rounded-xl shadow-shape"
        animate={open ? "open" : "closed"}
        variants={{
          closed: {
            height: 44,
            transition: {
              type: "inertia",
            },
          },
          open: {
            height: "auto",
            transition: {
              duration: 0.1,
            },
          },
        }}
      >
        {!open && <UploadWidgetMinimizedButton />}
        
        <Collapsible.Content>
          <UploadWidgetHeader />
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </motion.div>
    </Collapsible.Root>
  )
}