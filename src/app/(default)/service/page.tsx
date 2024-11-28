export default function Service() {
  const headingStyle = "font-bold text-xl";
  return (
    <div className="max-w-[840px] mx-auto">
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
      {[
        {
          heading: "リリカルへようこそ",
          description:
            "リリカルは、ユーザーが音楽の楽曲情報・解釈・考察を投稿して、ユーザー同士がそのコンテンツを楽しめるメディアプラットフォームです。",
        },
        {
          heading: "リリカルが大切にしていること",
          description:
            "音楽をもっと楽しく。 音楽は耳で聴くだけじゃない！歌詞・歌唱・映像・音源・振付などで彩られる、総合的な感覚体験である。あなたの小さな気づきが、誰かにとっての新たな感動に繋がり、より素晴らしい音楽体験となる。音楽と出会い、想いに共感して、好きを共有する場所、それがリリカル。",
        },
        {
          heading: "リリカルが大切にしていること",
          description:
            "音楽をもっと楽しく。 音楽は耳で聴くだけじゃない！歌詞・歌唱・映像・音源・振付などで彩られる、総合的な感覚体験である。あなたの小さな気づきが、誰かにとっての新たな感動に繋がり、より素晴らしい音楽体験となる。音楽と出会い、想いに共感して、好きを共有する場所、それがリリカル。",
        },
      ].map((item, index) => (
        <div key={index} className="border m-8 p-4">
          <p className={headingStyle}>{item.heading}</p>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
