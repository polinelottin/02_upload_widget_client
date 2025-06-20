import * as Collapsible from "@radix-ui/react-collapsible";
import { motion, useCycle } from "motion/react";

import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";
import { usePendingUploads } from "../store/uploads";

export function UploadWidget() {
  const { isThereAnyPendingUploads } = usePendingUploads()
  const [open, toggleOpen] = useCycle(false, true);

  return (
    <Collapsible.Root onOpenChange={() => toggleOpen()} asChild>
      <motion.div
        data-progress={isThereAnyPendingUploads}
        className="bg-zinc-900 overflow-hidden w-[360px] rounded-xl data-[state=open]:shadow-shape border border-transparent animate-border data-[state=closed]:rounded-3xl  data-[state=closed]:data-[progress=true]:[background:linear-gradient(45deg,#09090B,theme(colors.zinc.900)_50%,#09090B)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.zinc.700/.48)_80%,_theme(colors.indigo.500)_86%,_theme(colors.indigo.300)_90%,_theme(colors.indigo.500)_94%,_theme(colors.zinc.600/.48))_border-box]"
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