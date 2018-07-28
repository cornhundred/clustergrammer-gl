'''
Python 2.7
The clustergrammer python module can be installed using pip:
pip install clustergrammer

or by getting the code from the repo:
https://github.com/MaayanLab/clustergrammer-py
'''

from clustergrammer import Network
net = Network()

import numpy as np
import pandas as pd

# generate random matrix
num_rows = 3000
num_cols = 2
np.random.seed(seed=100)
mat = np.random.rand(num_rows, num_cols)

# make row and col labels
rows = range(num_rows)
cols = range(num_cols)
rows = [str(i) for i in rows]
cols = [str(i) for i in cols]

# make dataframe
df = pd.DataFrame(data=mat, columns=cols, index=rows)

# load matrix tsv file
# net.load_file('data/txt/rc_two_cats.txt')
# net.load_file('txt/ccle_example.txt')
# net.load_file('txt/rc_val_cats.txt')
# net.load_file('txt/number_labels.txt')
# net.load_file('txt/mnist.txt')
# net.load_file('txt/tuple_cats.txt')
# net.load_file('txt/example_tsv.txt')

# net.enrichrgram('KEA_2015')

# optional filtering and normalization
##########################################
# net.filter_sum('row', threshold=20)
# net.normalize(axis='col', norm_type='zscore', keep_orig=True)
# net.filter_N_top('row', 3, rank_type='sum')
# net.filter_threshold('row', threshold=3.0, num_occur=4)
# net.swap_nan_for_zero()
# net.set_cat_color('col', 1, 'Category: one', 'blue')

  # net.make_clust()
  # net.dendro_cats('row', 5)

net.load_df(df)

net.cluster(dist_type='cos',views=['N_row_sum', 'N_row_var'] , dendro=True,
               sim_mat=False, filter_sim=0.1, calc_cat_pval=False, enrichrgram=True)

# write jsons for front-end visualizations
net.write_json_to_file('viz', 'data/big_data/custom.json', 'indent')
# net.write_json_to_file('sim_row', 'json/mult_view_sim_row.json', 'no-indent')
# net.write_json_to_file('sim_col', 'json/mult_view_sim_col.json', 'no-indent')
