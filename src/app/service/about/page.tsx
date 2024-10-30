export default function About() {
  return (
    <div>
      <h1 className=" text-center text-lg font-bold">リリカルとは</h1>
      <div className="flex flex-row justify-center space-x-4">
        <a
          href="http://localhost:3000/service"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          サービス
        </a>
        <a
          href="http://localhost:3000/service/about"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          運営
        </a>
      </div>
      <div className="border m-8">
        <p>
          リリカルは、新たな文化仲介者となることで、誰もがコンテンツ体験を楽しめる世界を実現します。
        </p>
      </div>
      <div className="flex-col flex items-center space-y-4">
        <div>
          <p className="font-bold text-lg">
            Vison(ビジョン)
            <span className="text-sm text-slate-600">
              リリカルが実現する世界
            </span>
          </p>
          <p>コンテンツ体験を通じて、人生が豊かになる世界</p>
        </div>
        <div>
          <p className="font-bold text-lg">
            Mission(ミッション)
            <span className="text-sm text-slate-600">リリカルが果たす役割</span>
          </p>
          <p>コンテンツ体験の価値向上に貢献する</p>
        </div>
        <div>
          <p className="font-bold text-lg">
            Value(価値観){" "}
            <span className="text-sm text-slate-600">
              企業活動を通じて体現する信念
            </span>
          </p>
          <p>本文</p>
        </div>
        <div>
          <p className="font-bold text-lg">
            Principles(行動規範){" "}
            <span className="text-sm text-slate-600">遵守する行動の基準</span>
          </p>
          <p>本文</p>
        </div>
      </div>
    </div>
  );
}
