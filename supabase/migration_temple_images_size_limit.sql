-- temple-imagesバケットの上限サイズを引き上げる
-- （デフォルトのままだとPDFチラシ等の添付でエラーになるため。
--  管理者専用バケットなので上限を上げても外部からの不正アップロードのリスクは変わらない）
-- Supabase Dashboard > SQL Editor で実行してください。

update storage.buckets set file_size_limit = 20971520 where id = 'temple-images'; -- 20MB
