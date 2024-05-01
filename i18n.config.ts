export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      brand: 'Gmail Purge',
      brandDescription: 'Purge your mails in your gmail inbox',
      signIn: 'Sign in with Google',
      category: 'Category',
      age: 'Age',
      read: 'Read',
      search: 'Search',
      searchResult: 'Found {count} of {totalCount} mails in 1 page | Found {count} of {totalCount} mails in {pageCount} pages',
      tips: 'Copy the text below and paste it in Gmail\'s search box to view these mails',
      whatDoYouWant: 'What do you want to do?',
      choiceTrash: 'Mark all as read and move to trash',
      choiceDelete: 'Delete all (cannot be undone)',
      execute: 'Execute',
      errorLogin: 'Login failed',
      errorOperation: 'Operation failed',
      successOperation: 'Operation successful'
    },
    zh: {
      brand: 'Gmail Purge',
      brandDescription: '快速清除你的 Gmail 信箱',
      signIn: '使用 Google 登入',
      category: '標籤',
      age: '時間',
      read: '已讀',
      search: '搜尋',
      searchResult: '找到 {count} 封信，總共 {totalCount} 封信。共 1 頁。 | 找到 {count} 封信，總共 {totalCount} 封信。共 {pageCount} 頁。',
      tips: '複製下方的指令到 Gmail 搜尋欄中貼上查看詳細搜尋結果',
      whatDoYouWant: '請選擇要如何操作',
      choiceTrash: '標記成已讀並移動到垃圾桶',
      choiceDelete: '刪除（無法復原）',
      execute: '執行',
      errorLogin: '登入失敗',
      errorOperation: '操作失敗',
      successOperation: '操作成功'
    }
  }
}))
