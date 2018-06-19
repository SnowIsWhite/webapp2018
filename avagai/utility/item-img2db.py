import os

target_folder_dir = '../public/img/having'
save_dir = './having_db.txt'

with open(save_dir, 'w') as f:
    f.write('')

def make_query(fname, ftype, cnt):
    query = 'INSERT INTO having_items(file_name, renamed, file_type) VALUES("{}","having-{}","{}");';
    query = query.format(fname, cnt, ftype)
    with open(save_dir, 'a') as f:
        f.write(query+'\n')

cnt = 0
for path, dir, files in os.walk(target_folder_dir):
    for f in files:
        cnt += 1
        fname = f.split('.')[0]
        ftype = f.split('.')[-1]
        make_query(fname, ftype, str(cnt))
        # change file name
        os.rename(os.path.join(target_folder_dir, f), os.path.join(target_folder_dir, 'having-{}.{}'.format(str(cnt), ftype)))
