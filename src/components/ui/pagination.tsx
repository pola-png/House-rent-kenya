"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"

import { cn } from "@/lib/utils"

const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-2", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

type PaginationLinkProps = {
  isActive?: boolean
  size?: "icon" | "default" | "sm"
} & React.ComponentProps<typeof Link>

const getSizeClasses = (size: PaginationLinkProps["size"] = "default") => {
  switch (size) {
    case "icon":
      return "h-10 w-10 p-0";
    case "sm":
      return "h-9 min-w-[2.25rem] px-2 text-xs";
    default:
      return "h-10 min-w-[2.5rem] px-3";
  }
}

const PaginationLink = ({
  className,
  isActive,
  size = "default",
  ...props
}: PaginationLinkProps) => (
  <Link
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition-colors hover:border-[#0F60B6] hover:text-[#0F60B6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F60B6]/30 focus-visible:ring-offset-2",
      getSizeClasses(size),
      isActive && "border-[#0F60B6] bg-[#0F60B6] text-white hover:text-white",
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationItem>
    <PaginationLink
      aria-label="Go to previous page"
      size="icon"
      className={cn(className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </PaginationLink>
  </PaginationItem>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationItem>
    <PaginationLink
      aria-label="Go to next page"
      size="icon"
      className={cn(className)}
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  </PaginationItem>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    className={cn(
      "flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
