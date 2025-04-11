# Unity-Study

Unity-Studyは機能を実装し、それがどのような結果になるのか実際にUnityWebGLで確認しつつ楽しくUnityについて学べるAppになります。

公開URL：https://unity-study.vercel.app/

## 開発の経緯

実際にUnityの機能実装について解説しているサイトはあるが、実際に、そして手軽に動かして確認するサイトが無かったため。
技術サイトを参考にしてUnityで実装しても思っている動作と別の物だったり実際の動作がわからずに時間を無駄にしてしまったことがあるため。

## アプリの使用方法

**Welcome Page**
![非ログイン時のWelcomePage画面](/public/images/welcomepage_gest.png)
![ログイン時のWelcomePage画面](/public/images/welcomepage_user.png)

- 非ログイン時は中央のボタンがLoginページに飛ぶようになっています。
- ログイン時は中央のボタンがPostsページに飛ぶようになっています。
  **Header**
- ログイン中にLogoutを押すとログアウト出来ます。

**Login**
![Login画面](/public/images/login.png)

- ログインページです。ここからe-mailとpasswordを入力することでログインすることが出来ます。
  テストユーザーはemail:user@test1.com wassword:test　になります。

**Posts**
![Posts画面](/public/images/posts.png)

- 学習ページに飛べます。
- 学習が完了か未完了かも確認できます(緑:完了　赤:未完了)

**学習ページ**
![学習ページ画面](/public/images/学習ページ.png)

- Unityについて学べる記事がみれます（誠意製作中）
- 下部のボタンを押すことで学習上状況を完了、未完了切り替えることが出来ます。

**DEMO**
![DEMO画面(Unity起動時)](/public/images/DEMO1.png)
![DEMO画面(Unity非起動時)](/public/images/DEMO2.png)

- 実際にWebGLを動かすことが出来ます。
- 学習状況適応を押すと学習状況が適応したものになります。（現在は学習完了の数だけplayerが増えるようになっています）
- Unityを終わらせるを押すとUnityを止めることが出来ます。※止めないと他のページに飛ぶ際エラーが起きます。

## 仕様技術スタック

- **フロントエンド**:React(TypeScript)+Next.js
- **スタイリング**:Tailwind CSS
- **主要ライブラリ**:

  - uuid
  - FontAwesome
  - dayjs
  - date-fns
  - react-unity-webgl
  - Supabase Realtime

- **バックエンド**
- Supabase
- Authentication
- PostgreSQL
- Realtime Subscriptions
- **インフラ・開発環境**
  - Vercel (ホスティング)
  - Git/GitHub
  - VSCode
  - ESLint/Prettier

## 苦労した点

- Userの認証機能
- Postの解放条件に合わせて解放する機能
- 学習状況の管理機能
- Next.jsのUnityのホスティング
- ReactからUnityの関数呼び出し

## 今後の展望

- 機能拡張
  - シューティングやアクションなどの学習内容の追加。
    - それぞれのゲームの設計の仕方など
- 改善計画
  - 内容をちゃんとUnity学習に合ったものにする。
  - Userの認識をもう少しきちんとしたものにする。
  - tokenの認識を早くする
  - UIの調整
  - DEMOのUnityを終わらせるボタンがなくてもいいようにする
  - サインアップ機能の追加
