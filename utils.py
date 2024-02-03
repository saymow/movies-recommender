import csv
from numpy import genfromtxt
from collections import defaultdict
import pandas as pd
import tabulate

def load_data():
    item_train = genfromtxt('./data/content_item_train.csv', delimiter=',')
    user_train = genfromtxt('./data/content_user_train.csv', delimiter=',')
    y_train = genfromtxt('./data/content_y_train.csv', delimiter=',')
    
    with open('./data/content_item_train_header.txt', newline='') as f:
        item_features = list(csv.reader(f))[0]
    with open('./data/content_user_train_header.txt', newline='') as f:
        user_features = list(csv.reader(f))[0]

    item_vecs = genfromtxt('./data/content_item_vecs.csv', delimiter=',')

    movie_dict = defaultdict(dict)
    count = 0
    
    with open('./data/content_movie_list.csv', newline='') as csv_file:
        reader = csv.reader(csv_file, delimiter=',', quotechar='"')

        for line in reader:
            if count == 0:
                count += 1
            else:
                movie_id = int(line[0])
                movie_dict[movie_id]["title"] = line[1]
                movie_dict[movie_id]["genres"] = line[2]

    with open('./data/content_user_to_genre.pickle', 'rb') as f:
        user_to_genre = pd.read_pickle(f)

    return (item_train, user_train, y_train, item_features, user_features, item_vecs, movie_dict, user_to_genre)

def pprint_train(x_train, features, vs, u_s, maxcount=5, user=True):
    if user:
        flist = [".0f", ".0f", ".1f",
                 ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f", ".1f"]
    else:
        flist = [".0f", ".0f", ".1f", 
                 ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f", ".0f"]
    head = features[:vs]
    for i in range(u_s):
        head[i] = "[" + head[i] + "]"
    genres = features[vs:]
    hdr = head + genres
    disp = [hdr]
    count = 0
    
    for i in range(0, x_train.shape[0]):
        if count == maxcount: break
        count += 1
        disp.append([
            x_train[i, 0].astype(int),
            x_train[i, 1].astype(int),
            x_train[i, 2].astype(float),
            *x_train[i, 3:].astype(float)            
        ])

    table = tabulate.tabulate(disp, tablefmt='html', headers='firstrow', floatfmt=flist, numalign='center')

    return table

# def split_str(ifeatures, smax):
#     ofeatures = []

#     for s in ifeatures:
#         if not ' ' in s:
#             if len(s) > smax:
#                 mid =
    
#     return ofeatures 
    

