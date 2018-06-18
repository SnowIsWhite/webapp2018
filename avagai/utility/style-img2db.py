import os

target_folder_dir = '../public/img/style/style-image'
save_dir = './img_db.txt'

with open(save_dir, 'w') as f:
    f.write('')
    
def make_query(category, fname, ftype):
    query = 'INSERT INTO style_types(category, file_name, file_type) VALUES("{}","{}","{}");';
    query = query.format(category, fname, ftype)

    with open(save_dir, 'a') as f:
        f.write(query+'\n')

i = 0
for path, dir, files in os.walk(target_folder_dir):
    if i == 0:
        i += 1
        continue
    else:
        for p, d, fs in os.walk(path):
            category = p.split('/')[-1];
            for f in fs:
                fname = f.split('.')[0]
                ftype = f.split('.')[-1]
                make_query(category, fname, ftype)
