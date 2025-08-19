import { BoardSvg } from "@/components/assets/BoardSvg";
import { SaveSvg } from "@/components/assets/SaveSvg";
import { SettingsSvg } from "@/components/assets/SettingsSvg";
const  UserProfile=()=> {
    return (
        <div className="min-h-screen w-full bg-white text-neutral-900 flex justify-center">
      <div className="w-full max-w-[935px] px-4 sm:px-6 pb-16 border-2 border-red-500 ">
        
        <div className="mt-6  rounded-2xl p-6 sm:p-8 ">
          <div className="flex gap-6 sm:gap-8 ">
            
            <div className="shrink-0 ">
              <div className="w-24 h-24 sm:w-40 sm:h-40 rounded-full p-[3px] bg-gradient-to-tr from-fuchsia-500 to-yellow-400">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  
                  avatar
                </div>
              </div>
            </div>

           
            <div className="flex-1 min-w-0 ">
             
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl font-semibold">username</h1>
                <button className="px-3 py-1.5 text-sm rounded-xl bg-neutral-100 hover:bg-neutral-200">Edit Profile</button>
                <button className="px-3 py-1.5 text-sm rounded-xl bg-neutral-100 hover:bg-neutral-200">Ad tools</button>
                <button className="p-2 rounded-xl  hover:bg-neutral-200">
                 <SettingsSvg/>
                </button>
              </div>

              
              <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>10 posts</div>
                <div>10 followers</div>
                <div>10 following</div>
              </div>

              {/* Name + bio */}
              <div className="mt-4 space-y-1 text-sm leading-6">
                <div className="font-semibold">Upvox</div>
                <div className="text-neutral-700">Product/service</div>
                <div>Your favorite fun clips in <span className="inline-flex items-center gap-1 border px-1.5 py-0.5 rounded-md text-xs">EN</span> in your language 🌐</div>
                <a href="#" className="text-sky-600 hover:underline">upvox.net</a>
              </div>
            </div>
          </div>

        
          
        </div>

        
        <div className=" border-b flex items-center justify-center gap-8 text-xs tracking-wider text-neutral-500 ">
          <button className="-mb-px pb-3  border-neutral-900 text-neutral-900 font-semibold flex items-center gap-2 ">
         <BoardSvg/>
            POSTS
          </button>
          <button className="pb-3 hover:text-neutral-800 flex gap-2 items-center">
            
            <SaveSvg/>
          
            SAVED
          </button>
        </div>
        <div className="grid grid-cols-3 border-2 gap-1 ">
            <div className="border-2 border-red-500 h-[300px] ">post</div>
            <div className="border-2 border-red-500 h-[300px] ">post</div>
            <div className="border-2 border-red-500 h-[300px] ">post</div>
            <div className="border-2 border-red-500 h-[300px] ">post</div>

        </div>

         <div className="mt-8 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-800 animate-spin" />
        </div> 
      </div>
    </div>

    )
}
export default UserProfile;