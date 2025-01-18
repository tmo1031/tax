"use strict";
// ユーザーリストの作成
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
];
// ユーザーリストを表示する関数
function displayUsers(users) {
    users.forEach((user) => {
        console.log(`ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
    });
}
// 関数の実行
displayUsers(users);
//# sourceMappingURL=index.js.map