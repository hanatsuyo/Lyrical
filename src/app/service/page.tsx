export default function Service() {
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
        <p className="font-bold">リリカルへようこそ</p>
        <p>
          リリカルは、ユーザーが音楽の楽曲情報・解釈・考察を投稿して、
          ユーザー同士がそのコンテンツを楽しめるメディアプラットフォームです。
        </p>
      </div>
      <div className="border m-8">
        <p className="font-bold">リリカルが大切にしていること</p>
        <p>
          音楽をもっと楽しく。 音楽は耳で聴くだけじゃない！
          歌詞・歌唱・映像・音源・振付などで彩られる、総合的な感覚体験である。
          あなたの小さな気づきが、誰かにとっての新たな感動に繋がり、より素晴らしい音楽体験となる。
          音楽と出会い、想いに共感して、好きを共有する場所、それがリリカル。
        </p>
      </div>
      <div className="border m-8">
        <p className="font-bold">リリカルの３つの特徴</p>
        <p>01 アーティスト・楽曲の情報を追加・発見する</p>
        <p>02 あなたしか知らないアーティスト・楽曲の魅力をシェアする</p>
        <p>03 ユーザー同士で交流するSNSとして活用する</p>
      </div>
    </div>
  );
}
