<?php

/*
     *  image
     *
     * */
    public function image(){

        $img = I('post.base64'); //获取图片base64
        $data['id'] = I('post.mid');//获取用户id
        $root = getcwd();  //获取根目录
        $date = date('Y-m-d'); //当日
        $dir = "/Uploads/Member/".$date."/"; //选择你喜欢的文件夹
        if(!file_exists($root.$dir)) {
            mkdir($root.$dir, 0755, true); //判断是否有文件夹,没有就新建 自动建。需要权限
        }
        if (preg_match('/^(data:\s*image\/(\w+);base64,)/', $img, $result)){
            //用正则取出文件后缀
            $type = $result[2];
            //拼接路径
            $path = $dir.time().$data['id'].".".$type;
            //拼接完整路径。。包括/var/www/html/项目    linux下路径
            $new_file = $root.$path;
            //echo $new_file;exit;
            //将文件解码保存
            if (file_put_contents($new_file, base64_decode(str_replace($result[1], '', $img)))){
                $response['code'] = 20000;
                $response['msg'] = '上传成功';
                $response['path'] = $path;
                $save['headimg'] = $path;
                //保存数据库
                M('Member')->where($data)->save($save);
            }else{
                $response['code'] = 40000;
                $response['msg'] = '上传失败';
            }
        };
        $this->ajaxReturn($response);
    }



>