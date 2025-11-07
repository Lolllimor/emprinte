export function Initiatives() {
  return (
    <section id="initiatives" className="w-full bg-[#F0FFFD] px-6 py-8 xl:pt-[133px] lg:pt-[90px] md:pt-[80px] pt-[60px] lg:px-[75px] xl:px-[120px] flex flex-col items-start gap-7">
      <div className="w-full flex flex-col  md:flex-row md:justify-between md:items-end lg:items-end xl:items-center items-start gap-4">
        <div className="flex flex-col gap-4  md:max-w-[500px]">
          <div className="flex h-6 px-4 justify-center items-center gap-2.5 rounded-3xl bg-[#E63715] w-fit">
            <span className="text-xs md:text-base leading-[150%] font-normal text-white font-campton">
              Virtual Bootcamps
            </span>
          </div>

          <h2 className="text-[32px] lg:text-[45px] xl:text-[64px] leading-[40px] lg:leading-[50px] xl:leading-[64px] font-bold text-[#015B51] font-lora">
            Take Action, Make Progress.
          </h2>
        </div>

        <p className="text-base lg:text-xl xl:text-2xl leading-[24px] lg:leading-[28px] xl:leading-[32px] font-medium text-[#7B7B7B] font-campton md:max-w-[350px] lg:max-w-[400px] xl:max-w-[574px]">
          Our bootcamps push you to live what you learn. Join a group of
          motivated readers, commit to daily tasks, and holding each other
          accountable.
        </p>
      </div>
    </section>
  );
}
