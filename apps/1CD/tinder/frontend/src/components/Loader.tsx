"use client"
export const Loader = ()=>{
    return (
        <div className="flex flex-col justify-center items-center h-24 gap-6">
        <div className="w-10 h-10 border-8 border-t-transparent border-[#E11D48] border-solid rounded-full animate-spin"></div>
        <div className="text-sm text-muted-foreground">Please Wait...</div>
      </div>
    )
}