load "./junction_points.rb"

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

edges = [[1,2], [2,3]]
arr = []
edges.each do |edge|
    arr << [edge[0], edge[1], calculate_distance(edge)]
end
pp arr