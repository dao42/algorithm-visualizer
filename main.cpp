// 冒泡排序（Bubble Sort）

// 导入可视化库 {
#include "algorithm-visualizer.h"
// }
#include <sstream>

// 定义输入数组变量
#define N   15
#define MIN 1
#define MAX 20

void BubbleSort(int start, int end, int array[]);

// 定义跟踪变量 {
void PrintlnArray(const char* msg, int count,int array[]);
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

    // logger {
    PrintlnArray("original", N - 1, array);
    // }

    BubbleSort(0, N - 1, array);

    // logger {
    PrintlnArray("sorted", N - 1, array);
    // }

    return 0;
}

// logger {
void PrintlnArray(const char* msg, int count,int array[]) 
{
    std::ostringstream os;
    os << msg << " array = [";
    for (int i = 0; i < count; i++) {
        os << array[i] << ", ";
    }
    os << "]";
    logger.println(os.str());
}
// }

void BubbleSort(int start, int end, int array[])
{
    // visualize {
    array1DTracer.select(end);
    Tracer::delay();
     // }

    int newEnd = start;
    for(int i = start; i < end; ++i)
    {
        // logger {
        array1DTracer.select(i);
        array1DTracer.select(i + 1);
        Tracer::delay();
        // }
        if(array[i] > array[i + 1])
        {
            // logger {
            std::ostringstream os;
            os << "swap " << array[i] << " and " << array[i + 1];
            logger.println(os.str());
            // }
            std::swap(array[i], array[i + 1]);
            // logger {
            array1DTracer.patch(i, array[i]);
            array1DTracer.patch(i + 1, array[i + 1]);
            Tracer::delay();
            array1DTracer.depatch(i);
            array1DTracer.depatch(i + 1);
            // }
            newEnd = i;
        }
        // logger {
        array1DTracer.deselect(i);
        array1DTracer.deselect(i + 1);
        // }
    }

    if(newEnd == start)
    {
        return;
    }
    else
    {
        BubbleSort(start, newEnd, array);
    }
}
