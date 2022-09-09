# 算法可视化

> 通过该代码空间，可以把写出来的算法进行可视化，让你更清晰的知道该算法的运作原理。

通过可视化算法，学习算法变得容易得多。以下通过几个小步骤，带你快速入门。

## 目录结构

```
.
├── algorithm-visualizer                项目主体
│   ├── algorithms                      算法文件夹
│   │   ├── 分治(Divide and Conquer)     算法分类文件夹
│   │   │   └── 计数排序（Counting sort） 具体某种算法
│   │   │       ├── code.js             javascript实现代码
│   │   │       ├── main.cpp            cpp实现代码
│   │   │       └── README.md           该算法的一些介绍和参考文献
│   ├── tmp                             算法临时文件夹，临时生成算法，如果Build失败会在这里有相关文件
│   └── ...                             其他无关文件夹
└── tmp                                 临时文件夹，存放环境安装的文件
```

## 运行

1. 点击运行按钮，等待项目运行起来后，打开输出窗口。首页是当前算法文件夹下已有的算法文件，点击某一个算法即可进入该算法的可视化页面。
   ![](https://1024-staging-1258723534.cos.ap-guangzhou.myqcloud.com/avatar/2022090210-HqIcxy9kxhKIfgVe.png)

2. 进入可视化页面，默认运行Build，成功后点击播放即可查看可视化效果，也可以单步查看或者调整播放速度
   ![](https://1024-staging-1258723534.cos.ap-guangzhou.myqcloud.com/avatar/2022090221-ZwT1lyyiqMpol1YG.png)

3. 编辑编辑器的算法文件，通过修改输入变量或其他地方，然后重新Build即可查看新修改的可视化效果
   ![](https://1024-staging-1258723534.cos.ap-guangzhou.myqcloud.com/avatar/2022090220-0ewed5Y4XAtj35yw.png)

PS: 目前Build失败还没有提示，不过会在算法临时文件夹输出失败的文件，可以通过gdb在Shell调试。

## 如何写一个新的算法

> 通过可视化库，让算法按照你的想法可视化起来～

### CPP

在算法文件夹中相应位置新建一个算法目录，新建main.cpp。可视化的实现基于可视化库，具体可以使用的API可以看下面的文档～

```cpp
// 导入可视化库 {
#include "algorithm-visualizer.h"
// }

// 定义跟踪变量 {
ChartTracer chartTracer("ChartTracer");
Array1DTracer array1DTracer("Array1DTracer");
LogTracer logger("LogTracer");
// }


int main() {
    // 定义跟踪变量 {
    int array[N];
    Randomize::Array1D<int>(N, *(new Randomize::Integer(MIN, MAX))).fill(&array[0]);
    array1DTracer.set(array);
    array1DTracer.chart(chartTracer);
    Layout::setRoot(VerticalLayout({ chartTracer, array1DTracer, logger }));
    Tracer::delay();
    // }

    // TODO 这里写算法的具体实现和可视化库的插槽
    // ...

    return 0;
}
```

## algorithm-visualizer API

[https://github.com/algorithm-visualizer/algorithm-visualizer/wiki](https://github.com/algorithm-visualizer/algorithm-visualizer/wiki)