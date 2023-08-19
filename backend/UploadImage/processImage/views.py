from django.shortcuts import render
from processImage.models import Picture
from processImage.serializers import PictureSerializer
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
import cv2
import numpy as np
from paddleocr import PaddleOCR
from vietocr.tool.predictor import Predictor
from vietocr.tool.config import Cfg
from PIL import Image
import torch
import os
# Create your views here.


class PicViewSet(viewsets.ModelViewSet):
    queryset = Picture.objects.all()
    serializer_class = PictureSerializer


class RecognizeView(APIView):
    def post(self, request):
        imgs = request.data.get('str')
        filepath = "...../Testimage/backend/UploadImage/uploads/2023/07/{}".format(imgs)
        print(filepath)
        img = cv2.imread(filepath)
        # Code to handle GET request
        blur_img = cv2.GaussianBlur(img, (5, 5), 0)
        hsv_img = cv2.cvtColor(blur_img, cv2.COLOR_BGR2HSV)
        lower_red = np.array([0, 50, 50])
        upper_red = np.array([30, 255, 255])
        lower_red2 = np.array([150, 50, 50])
        upper_red2 = np.array([180, 255, 255])
        mask1 = cv2.inRange(hsv_img, lower_red, upper_red)
        mask2 = cv2.inRange(hsv_img, lower_red2, upper_red2)
        mask = mask1 + mask2
        d = cv2.inpaint(img, mask, 0 , cv2.INPAINT_TELEA)
        gray_img = cv2.cvtColor(d, cv2.COLOR_BGR2GRAY)
        ocr = PaddleOCR(use_angle_cls=True, lang='en')
        bboxes = ocr.ocr(gray_img, cls=True)
        boxes = [bbox[0] for sub1 in bboxes for bbox in sub1]
        ltext = []
        device = torch.device("cpu")
        config = Cfg.load_config_from_name('vgg_seq2seq')
        config['device'] = 'cpu'
        predictor = Predictor(config)    
        for index,box in enumerate(boxes):
            pts = np.float32(box)
            rect = np.zeros((4, 2), dtype="float32")
            s = pts.sum(axis=1)
            rect[0] = pts[np.argmin(s)]
            rect[2] = pts[np.argmax(s)]
            diff = np.diff(pts, axis=1)
            rect[1] = pts[np.argmin(diff)]
            rect[3] = pts[np.argmax(diff)]
            (tl, tr, br, bl) = rect
            widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
            widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
            maxWidth = max(int(widthA), int(widthB))
            heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
            heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
            maxHeight = max(int(heightA), int(heightB))
            dst = np.array([
                [0, 0],
                [maxWidth - 1, 0],
                [maxWidth - 1, maxHeight - 1],
                [0, maxHeight - 1]], dtype="float32")
            M = cv2.getPerspectiveTransform(rect, dst)
            warped = cv2.warpPerspective(gray_img, M, (maxWidth, maxHeight))
            # # cv2.imwrite("content/" + str(index) + ".jpg", dst)
            # # cv2.imshow("img",dst)
            image_pil = Image.fromarray(warped)
            image_pil = image_pil.convert('RGB')
            text = predictor.predict(image_pil)
            ltext.append(text)
        os.remove(filepath)
        print(ltext)
        return Response(ltext)


