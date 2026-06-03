function MessagesLoadingSkeleton() {
  return (
    <div className="mx-auto space-y-6">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}
        >
          <div className={`chat-bubble bg-slate-800/40 text-white w-72 h-20 rounded-2xl ${index % 2 === 0 ? "rounded-bl-none" : "rounded-br-none"} `}></div>
        </div>
      ))}
    </div>
  );
}
export default MessagesLoadingSkeleton;