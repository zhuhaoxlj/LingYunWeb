import os


def file_name(file_dir):
    filelist = 'var musicList = '
    for root, dirs, files in os.walk(file_dir):
        # print(root) #当前目录路径
        # print(dirs) #当前路径下所有子目录
        filelist += str(files)
    filelist += ';'
    fo = open("./js/musicList.js", 'w', encoding='utf-8')
    fo.write(filelist)
    print('文件生成成功！')
    # print(filelist)  #当前路径下所有非目录子文件


# path = input('请输入音乐文件的路径:')
path = './bgm'
file_name(path)
os.system('pause')