sudo chmod -R 777 /usr/local
curl --create-dirs -o /usr/local/include/nlohmann/json.hpp -L "https://github.com/nlohmann/json/releases/download/v3.1.2/json.hpp"
curl --create-dirs -o /workspace/tmp/algorithm-visualizer.tar.gz -L "https://github.com/algorithm-visualizer/tracers.cpp/archive/v2.3.6.tar.gz"
sudo chmod -R 777 /usr/local
cd /workspace/tmp
mkdir algorithm-visualizer
tar xvzf algorithm-visualizer.tar.gz -C algorithm-visualizer --strip-components=1
cd /workspace/tmp/algorithm-visualizer
mkdir build
cd build
cmake ..
sudo make install