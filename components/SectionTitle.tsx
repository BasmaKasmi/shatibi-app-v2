const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-center w-full">
      <h2 className="px-3 pr-5 font-extrabold text-xl text-black flex items-center">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;
