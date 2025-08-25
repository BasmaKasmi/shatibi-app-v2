const EvalStudentItem = ({ student }: any) => {
  return (
    <>
      <div
        style={{ cursor: "pointer" }}
        className={`flex items-center shadow-md rounded-2xl ml-2 ${
          student.abort === "0" ? "bg-white" : "bg-gray-500/25"
        }`}
      >
        <div
          className={`rounded-l-2xl h-full flex items-center justify-center p-1 ${
            student.abort === "0" ? "bg-shatibi-orange" : "bg-gray-300"
          }`}
        >
          <p className="text-white text-center text-md font-semibold px-2 w-12 h-12 rounded-full">
            {student.abort === "0" && (
              <>
                {student.nb_ap + student.nb_ai}
                <br />
                Abs
              </>
            )}
          </p>
        </div>
        <div className="flex items-center">
          <div className="pl-3">
            <p className="text-[14px] font-semibold">{student.name}</p>
            {student.abort !== "0" && (
              <p className="text-xs font-normal">
                Abandon depuis{" "}
                <span className="font-semibold">{student.abort}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EvalStudentItem;
