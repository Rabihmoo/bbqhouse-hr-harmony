
import * as React from "react"
import { useToast as useToastOriginal } from "@/hooks/use-toast"

// Re-export the hooks from the original location
export const useToast = useToastOriginal
export { toast } from "@/hooks/use-toast"
