function UsersLoadingSkeleton() {
  return (
    <div className="space-y-5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-slate-800/20 p-4 rounded-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <div className=" size-7.5 xsm:size-9.5 sm:size-11 bg-[#38BBAD]/20 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 sm:h-4 bg-[#38BBAD]/20 rounded w-3/4 mb-2"></div>
              <div className="h-2 sm:h-3 bg-[#38BBAD]/20 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
export default UsersLoadingSkeleton;