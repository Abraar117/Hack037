from flask import Flask, jsonify, render_template
import pandas as pd
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = Flask(__name__)

@app.route('/home',methods=['GET'])
def index():
    data = pd.read_csv('superstore_product_data.csv')
    #in data variable in column Month of Sale replace numbers 1 to 5 by 1, 6 to 9 by 2 and 10 to 12 by 3
    data['Month of Sale'] = data['Month of Sale'].replace([1, 2, 3, 4, 5], 1).replace([6, 7, 8, 9], 2).replace([10, 11, 12], 3)
    #inn the Sales column perform normalization
    data['Sales'] = (data['Sales'] - data['Sales'].min()) / (data['Sales'].max() - data['Sales'].min())
    #inn the Quantity column perform normalization
    data['Quantity'] = (data['Quantity'] - data['Quantity'].min()) / (data['Quantity'].max() - data['Quantity'].min())
    #in the Profit column perform normalization 
    data['Profit'] = (data['Profit'] - data['Profit'].min()) / (data['Profit'].max() - data['Profit'].min())
    #create a new column called ProfitOptimized which has the value 1 if the corressponding Profit column value is >0.8, value 2 if Profit column value is between 0.6 to 0.8 and value 3 if Profit column value is between 0.2 to 0.6 and value 4 if profit column value is between 0.0 to 0.2
    data['ProfitOptimized'] = data['Profit'].apply(lambda x: 1 if x > 0.8 else (2 if 0.6 <= x <= 0.8 else (3 if 0.2 <= x <= 0.6 else 4)))
    #create a new column called Popularity which has the value 1 if the corressponding Quantity column value is >0.8, value 2 if Quantity column value is between 0.6 to 0.8 and value 3 if Quantity column value is between 0.2 to 0.6 and value 4 if Quantity column value is between 0.0 to 0.2
    data['Popularity'] = data['Quantity'].apply(lambda x: 1 if x > 0.8 else (2 if 0.6 <= x <= 0.8 else (3 if 0.2 <= x <= 0.6 else 4)))
    #create a new column called SeasonalPopularity which has the value as an array where first element is the exact value in the Month of Sale column and second element is the exact value of Popularity column
    data['SeasonalPopularity'] = data[['Month of Sale', 'Popularity']].values.tolist()
    #create a bar graph of the ProfitOptimized column against Category
    metric1 = data.groupby('Category')['ProfitOptimized'].plot.bar()
    #create above graph into an image 
    metric1.get_figure().savefig('metric1.png')
    #createcreate a bar graph of the Popularity column against Category
    metric2 = data.groupby('Category')['Popularity'].plot.bar()
    #create above graph into an image
    metric2.get_figure().savefig('metric2.png')
    #create a line graph of the SeasonalPopularity column against Category
    metric3 = data.groupby('Category')['SeasonalPopularity'].plot.bar() 
    #create above graph into an image
    metric3.get_figure().savefig('metric3.png')
    #groupedmetric variable that creates a multiple line graph of category against the ProfitOptimized, Popularity and SeasonalPopularity variable
    groupedmetric = data.groupby('Category')[['ProfitOptimized', 'Popularity', 'SeasonalPopularity']].mean().plot.line()
    category_metrics = data.groupby('Category')['ProfitOptimized'].mean()

    plt.bar(category_metrics.index, category_metrics)
    plt.xlabel('Category')
    plt.ylabel('Profit Optimized')
    plt.title('Profit Optimized by Category')
    plt.xticks(rotation=45)

    # Save the plot as an image file
    img_path = 'src/plot.png'
    plt.savefig(img_path)
    plt.close()

    # Return the path to the saved image
    return {'image_path': img_path}
    
if __name__ == '__main__':
    app.run(debug=True)