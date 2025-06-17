import * as Collapsible from "@radix-ui/react-collapsible";
import { useState } from "react";

import { UploadWidgetHeader } from "./upload-widget-header";
import { UploadWidgetDropzone } from "./upload-widget-dropzone";
import { UploadWidgetUploadList } from "./upload-widget-upload-list";
import { UploadWidgetMinimizedButton } from "./upload-widget-minimized-button";

export function UploadWidget() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root onOpenChange={setOpen}>
      <div className="bg-zinc-900 w-full overflow-hidden min-w-[360px] rounded-xl shadow-shape">
        {!open && <UploadWidgetMinimizedButton />}
        
        <Collapsible.Content>
          <UploadWidgetHeader />
          <div className="flex flex-col gap-4 py-3">
            <UploadWidgetDropzone />

            <div className="h-px bg-zinc-800 border-t border-black/50 box-content" />

            <UploadWidgetUploadList />
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  )
}