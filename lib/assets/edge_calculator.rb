load "lib/assets/junction_points.rb"

$j_points = junctions
def find_by_id(arr, id)
    arr.each do |i|
        return i if i[:id] == id
    end
end

def calculate_distance(edge)

    from_point = find_by_id($j_points, edge[0])
    to_point = find_by_id($j_points,edge[1])

    x1 = from_point[:left]
    x2 = to_point[:left]

    y1 = from_point[:top]
    y2 = to_point[:top]

    Math.sqrt( (x1-x2)**2 + (y1-y2)**2 ) * 0.28960526315789475 # 1px mapped to map's covered distance in metre

end
# paste the output of edgeScript Here
edges = [[1, 2],
         [2, 3],
         [3, 4],
         [3, 5],
         [4, 6],
         [5, 7],
         [6, 8],
         [7, 8],
         [8, 9],
         [7, 10],
         [10, 11],
         [11, 12],
         [12, 13],
         [10, 15],
         [15, 17],
         [17, 19],
         [19, 21],
         [21, 23],
         [23, 27],
         [27, 25],
         [25, 26],
         [27, 28],
         [28, 29],
         [29, 32],
         [32, 36],
         [36, 37],
         [37, 38],
         [38, 41],
         [41, 42],
         [42, 46],
         [46, 47],
         [47, 48],
         [48, 49],
         [49, 50],
         [50, 51],
         [51, 53],
         [53, 61],
         [61, 62],
         [63, 62],
         [65, 73],
         [62, 66],
         [66, 71],
         [71, 74],
         [71, 72],
         [74, 75],
         [72, 73],
         [74, 79],
         [78, 79],
         [81, 82],
         [79, 80],
         [80, 81],
         [49, 82],
         [49, 83],
         [83, 84],
         [84, 85],
         [110, 111],
         [112, 111],
         [110, 158],
         [112, 113],
         [113, 114],
         [114, 116],
         [116, 117],
         [85, 118],
         [118, 119],
         [142, 113],
         [142, 143],
         [12, 144],
         [143, 144],
         [144, 145],
         [145, 146],
         [146, 147],
         [147, 148],
         [148, 149],
         [149, 151],
         [151, 119],
         [151, 152],
         [152, 153],
         [153, 157],
         [158, 19]]


arr = []
edges.each do |edge|
    arr << [edge[0], edge[1], calculate_distance(edge)]
end
pp arr

puts "\npaste the output to the edges.rb"