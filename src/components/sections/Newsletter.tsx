export function Newsletter() {
  return (
    <section className="w-full bg-[#142218] px-6 py-9  md:py-[98px] xl:px-[120px] lg:px-[64px] md:px-[32px] flex flex-col items-end gap-8">
      <div className="w-full flex flex-col justify-center items-start gap-3">
        <div className="flex w-fit h-[31px] px-2.5 justify-center items-center gap-2.5 rounded-3xl bg-[#E63715]">
          <span className="text-xs md:text-base leading-[150%] font-normal text-white font-campton">
            Join our Newletter
          </span>
        </div>

        <div className="flex flex-col items-start gap-2 md:gap-4 w-full">
          <h2 className="text-2xl md:text-[40px] leading-[32px] md:leading-[48px] font-semibold text-white font-lora">
            Explore Thousands of Stories with Us
          </h2>
          <p className="text-base md:text-2xl leading-[20px] md:leading-[24px] font-medium text-white font-campton">
            Subscribe to our mailing list to be the first to know about our
            events and more
          </p>
        </div>
      </div>

      <div className="w-full flex flex-col items-start gap-4">
        <div className="flex h-14 px-4 py-[15px] items-center gap-2.5 w-full rounded-lg bg-white max-w-[564px]">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 text-base leading-[32px] font-normal text-[#A7A7A7]  font-campton bg-transparent outline-none"
          />
        </div>

        <button className="flex h-14 px-2.5 justify-center items-center gap-2.5 w-full rounded-lg bg-white max-w-[564px]">
          <span className="text-xl leading-[150%] font-medium text-[#015B51] font-campton">
            Submit
          </span>
        </button>
      </div>
    </section>
  );
}
