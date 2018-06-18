import os

target_folder_dir = '../public/img/wanted'
save_dir = './wanted_db.txt'

with open(save_dir, 'w') as f:
    f.write('')

def make_query(fname, ftype):
    query = 'INSERT INTO wanted_items(file_name, file_type) VALUES("{}","{}");';
    query = query.format(fname, ftype)

    with open(save_dir, 'a') as f:
        f.write(query+'\n')

i = 0
for path, dir, files in os.walk(target_folder_dir):
    for f in files:
        fname = f.split('.')[0]
        ftype = f.split('.')[-1]
        make_query(fname, ftype)
