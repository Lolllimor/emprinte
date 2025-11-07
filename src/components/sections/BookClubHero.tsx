
interface BookClubHeroProps {
  badge?: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export function BookClubHero({
  badge = 'Book Club',
  title,
  description,
  buttonText = 'Join Now',
  onButtonClick,
}: BookClubHeroProps) {
  return (
    <div className="absolute md:relative left-7 top-12 md:left-0 md:top-0 w-[337px] lg:w-[464px] xl:w-[564px] flex flex-col items-start gap-6 md:mr-10 lg:mr-14 xl:mr-[120px]">
      <div className="flex h-6 px-4 justify-center items-center gap-2.5 rounded-3xl bg-[#E63715]">
        <span className="text-xs md:text-base leading-[150%] font-normal text-white font-campton">
          {badge}
        </span>
      </div>

      <div className="flex flex-col items-start gap-6">
        <h2 className="text-[32px] md:text-[36px] xl:text-[60px] leading-[120%] font-bold text-white font-lora">
          {title}
        </h2>

        <p className="text-base md:text-lg xl:text-2xl leading-[150%] font-normal text-white font-campton">
          {description}
        </p>
      </div>

      <button
        onClick={onButtonClick}
        className="w-full cursor-pointer h-12 px-2.5 flex justify-center items-center gap-2.5 rounded-lg bg-white"
      >
        <span className="text-xl leading-[150%] font-medium text-[#015B51] font-campton">
          {buttonText}
        </span>
      </button>
    </div>
  );
}
