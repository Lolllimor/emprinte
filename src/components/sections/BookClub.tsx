export function BookClub() {
  return (
    <section
      id="initiatives"
      className="w-full bg-white pb-3 lg:py-[55px] md:py-[35px] flex flex-col items-center pl-0 xl:pl-30 lg:pl-16 md:pl-10 max-w-[1440px] mx-auto"
    >
      <div className="w-full h-[542px] md:h-[650px] lg:h-full relative">
        <div className=" pl-6 md:pl-0 flex flex-col items-start gap-2 h-[116px] lg:h-fit">
          <div className="flex h-6 px-4 justify-center items-center gap-2.5 rounded-3xl bg-[#E63715]">
            <span className="text-xs md:text-base leading-[150%] font-normal text-white font-campton">
              Impacting Lives
            </span>
          </div>

          <h2 className="text-[32px] lg:text-[45px] xl:text-[60px] leading-tight max-w-[200px] lg:max-w-[300px] xl:max-w-[390px] font-bold text-[#015B51] font-lora">
            Explore our Initiatives
          </h2>
        </div>
        <img
          src="/big-world.png"
          alt="Book club"
          className="hidden md:block absolute right-0 top-0 xl:w-[906px] lg:w-[706px] w-[506px] mt-10 xl:h-[678px] lg:h-[578px] h-[478px] object-cover z-0"
        />

        <div className="relative md:flex xl:gap-6 gap-5 z-10 xl:mt-[45px] lg:mt-[35px] mt-[25px] lg:max-h-[705px] max-h-[505px] h-full hidden ">
          <div className="flex p-4 flex-col justify-center items-center gap-2 lg:rounded-3xl rounded-2xl bg-[#015B51] w-fit  h-fit">
            <div className="flex flex-col items-center">
              <div className="xl:text-[80px] lg:text-[60px] md:text-[45px] text-[40px] leading-tight font-bold text-center text-white font-lora">
                10,000
              </div>
              <div className="xl:text-[40px] lg:text-[30px] md:text-[20px] text-[20px] leading-tight font-medium text-center text-white font-campton">
                BOOKS
              </div>
            </div>

            <div className="w-full h-px bg-white"></div>

            <div className="flex flex-col items-center">
              <div className="xl:text-[80px] lg:text-[60px] md:text-[45px] text-[40px] leading-tight font-bold text-center text-white font-lora">
                52
              </div>
              <div className="xl:text-[40px] lg:text-[30px] md:text-[20px] text-[20px] leading-tight font-medium text-center text-white font-campton">
                COUNTRIES
              </div>
            </div>
          </div>
          <img
            src="/explore.png"
            alt="Book club"
            className="hidden md:block xl:w-[460px] lg:w-[360px] w-[260px] xl:h-[705px] lg:h-[605px] h-[505px] object-cover rounded-3xl"
          />
          <div className="flex lg:max-w-[429px] max-w-[247px] flex-1 flex-col gap-6 items-end justify-end">
            <h3 className="xl:text-[96px] lg:text-[64px]  md:text-[56px] xl:leading-[104px] lg:leading-[84px] leading-[64px]  font-bold text-[#142218] mb-2 font-lora">
              BUILD A READER
            </h3>
            <p className="xl:text-[32px] lg:text-[24px] md:text-[16px] xl:leading-[48px] lg:leading-[34px] leading-[24px] font-normal text-[#7B7B7B] font-campton">
              An initiative to put 10,000 books in the hands of 10,000 African
              teenagers by 2030.
            </p>
          </div>
        </div>
        <div className="block md:hidden absolute left-0 top-[114px] w-full h-[238px]">
          <div
            className="w-full h-[238px] px-6  flex items-center gap-2.5 bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/world.png')",
            }}
          >
            <div className="flex p-4 flex-col justify-center items-center gap-2 rounded-3xl bg-[#015B51] ">
              <div className="flex flex-col items-center">
                <div className="text-[40px] leading-tight font-bold text-center text-white font-lora">
                  5000
                </div>
                <div className="text-xl leading-tight font-medium text-center text-white font-campton">
                  BOOKS
                </div>
              </div>

              <div className="w-[114px] h-px bg-white"></div>

              <div className="flex flex-col items-center">
                <div className="text-[40px] leading-tight font-bold text-center text-white font-lora">
                  281
                </div>
                <div className="text-xl leading-tight font-medium text-center text-white font-campton">
                  AFRICANS
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="block md:hidden absolute left-6 top-[370px] w-[342px] h-[172px]">
          <h3 className="text-5xl leading-[56px] font-bold text-[#142218] mb-2 font-lora">
            BUILD A READER
          </h3>
          <p className="text-base leading-[24px] font-medium text-[#7B7B7B] font-campton">
            We set out to impact the lives of Nigerian Secondary School
            Students.
          </p>
        </div>
      </div>
    </section>
  );
}
