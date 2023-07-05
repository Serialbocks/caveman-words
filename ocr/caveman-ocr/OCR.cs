using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Threading;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace caveman_ocr
{
    public class OCR
    {
        public delegate void PrintInfoDelegate(string text);
        public delegate void NotifyCompleteDelegate(string text);

        private const string _pythonPath = "../../../ocr.py";
        private const string _ocrOutFile = "ocr.json";

        public enum OCRState
        {
            Initializing,
            Ready,
            Processing
        }
        public class BoundingBox
        {
            public float X1 { get; set; }
            public float Y1 { get; set; }
            public float X2 { get; set; }
            public float Y2 { get; set; }

            public bool IsWithin(BoundingBox box)
            {
                return X1 > box.X1 && X2 < box.X2 && Y1 > box.Y1 && Y2 < box.Y2;
            }
        }

        private Process _ocrProcess;
        private OCRState _state;
        private object stateLock = new object();
        private PrintInfoDelegate _printInfo;
        private NotifyCompleteDelegate _notifycomplete;
        public OCRState State
        {
            get
            {
                lock (stateLock)
                {
                    return _state;
                }
            }
            set
            {
                lock (stateLock)
                {
                    _state = value;
                }
            }
        }

        public OCR(PrintInfoDelegate printInfo, NotifyCompleteDelegate notifyComplete)
        {
            State = OCRState.Initializing;
            _printInfo = printInfo;
            _notifycomplete = notifyComplete;

            _printInfo("OCR Initializing...");
            _ocrProcess = new Process()
            {
                StartInfo = new ProcessStartInfo
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    CreateNoWindow = true,
                    FileName = "python",
                    Arguments = _pythonPath,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    RedirectStandardInput = true
                },
            };
            _ocrProcess.EnableRaisingEvents = false;
            _ocrProcess.OutputDataReceived += (sender, args) => HandleStdout(args.Data);
            _ocrProcess.ErrorDataReceived += (sender, args) => HandleStdout(args.Data);
            _ocrProcess.Start();
            _ocrProcess.BeginOutputReadLine();
            _ocrProcess.BeginErrorReadLine();
        }

        public void Process(string file)
        {
            if (State != OCRState.Ready)
            {
                _printInfo("Tried to process OCR in an unready state");
                return;
            }
            //_printInfo("OCR Processing...");
            State = OCRState.Processing;
            _ocrProcess.StandardInput.WriteLine(file);
        }

        public void Stop()
        {
            if (_ocrProcess != null && !_ocrProcess.HasExited)
            {
                _ocrProcess.Kill();
            }
        }

        private BoundingBox GetBoundingBoxFromGeometry(JProperty geometry)
        {
            var topLeft = geometry.First.First;
            var bottomRight = geometry.First.Last;
            return new BoundingBox
            {
                X1 = topLeft.First.Value<float>(),
                Y1 = topLeft.Last.Value<float>(),
                X2 = bottomRight.First.Value<float>(),
                Y2 = bottomRight.Last.Value<float>()
            };
        }

        private string ParseOCRData()
        {
            var values = new List<string>();
            float ProcessLine(JToken line)
            {
                var lineGeo = (JProperty)line.First;
                var lineBoundingBox = GetBoundingBoxFromGeometry(lineGeo);

                var words = line.Children().First(x => ((JProperty)x).Name == "words").First;
                foreach (var word in words)
                {
                    var wordValue = word.Children()
                        .First(x => ((JProperty)x).Name == "value").First
                        .Value<string>()
                        .Trim();
                    if(wordValue.Length > 2)
                        values.Add(wordValue);
                }
     
                return 0;
            }

            void ProcessBlock(JToken blockObj)
            {
                var geometry = (JProperty)blockObj.First;
                var boundingBox = GetBoundingBoxFromGeometry(geometry);
                var lines = blockObj.Children().First(x => ((JProperty)x).Name == "lines").First;

                foreach (var line in lines)
                {
                    var totalResult = ProcessLine(line);
                }
            }

            var jObject = JObject.Parse(File.ReadAllText(_ocrOutFile));
            var pages = jObject.First;
            var page = pages.First;
            var blocks = page
                .Children()
                .First()
                .Children()
                .First(x => ((JProperty)x).Name == "blocks")
                .First;
            foreach (var blockObj in blocks.Children())
            {
                ProcessBlock(blockObj);
            }

            var csvRow = new StringBuilder();

            if(values.Count > 1)
            {
                csvRow.Append(values[0]);
                csvRow.Append(",");
                for(var i = 1; i < values.Count; i++)
                {
                    csvRow.Append(values[i]);
                    csvRow.Append(" ");
                }
            }
            else
            {
                return "";
            }

            return csvRow.ToString().Substring(0, csvRow.Length - 1);
        }

        private void HandleStdout(string text)
        {
            switch (text)
            {
                case "Ready":
                    State = OCRState.Ready;
                    _printInfo("OCR Ready!");
                    break;
                case "Done":
                    var data = ParseOCRData();
                    _notifycomplete(data);
                    State = OCRState.Ready;
                    //_printInfo("OCR Done!");
                    break;
                default:
                    break;
            }
        }
    }
}
