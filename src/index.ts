// 型の定義
type User = {
  id: number;
  name: string;
  email: string;
};

// ユーザーリストの作成
const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
];

// ユーザーリストを表示する関数
function displayUsers(users: User[]): void {
  users.forEach((user) => {
    console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
  });
}

// 関数の実行
displayUsers(users);