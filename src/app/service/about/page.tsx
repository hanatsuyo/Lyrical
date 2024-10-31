export default function About() {
  const headingStyle = "font-bold text-3xl";
  const descriptionStyle = "mt-1 block text-sm text-slate-600";

  const sections = [
    {
      title: "Vision(ビジョン)",
      subtitle: "リリカルが実現する世界",
      description: "コンテンツ体験を通じて、人生が豊かになる世界",
    },
    {
      title: "Mission(ミッション)",
      subtitle: "リリカルが果たす役割",
      description: "コンテンツ体験の価値向上に貢献する",
    },
    {
      title: "Value(価値観)",
      subtitle: "企業活動を通じて体現する信念",
      description: "本文",
    },
    {
      title: "Principles(行動規範)",
      subtitle: "遵守する行動の基準",
      description: "本文",
    },
  ];

  return (
    <div>
      <h1 className="text-center text-lg font-bold">リリカルとは</h1>
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
      <div className="border m-8 max-w-[400px] mx-auto">
        <p>
          リリカルは、
          <br />
          新たな文化仲介者となることで、
          <br />
          誰もがコンテンツ体験を楽しめる世界を実現します。
        </p>
      </div>

      <div className="grid justify-center gap-12">
        {sections.map((section, index) => (
          <div key={index} className="text-center">
            <p className={headingStyle}>
              {section.title}
              <span className={descriptionStyle}>{section.subtitle}</span>
            </p>
            <p className="mt-4">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
