using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using System.Drawing.Imaging;

namespace caveman_ocr
{
    public partial class uxMainWindow : Form
    {
        public delegate void PrintInfoDelegate(string text);
        public delegate void NotifyCompleteDelegate(string info);
        private OCR _ocr;

        public uxMainWindow()
        {
            InitializeComponent();
            _ocr = new OCR(LogText, OnOcrProcessComplete);
            Application.ApplicationExit += new EventHandler(OnApplicationExit);
        }

        private void LogText(string text)
        {
            if (uxLog.InvokeRequired)
            {
                uxLog.Invoke(new Action(() => uxLog.AppendText(text + "\r\n")));
            }
            else
            {
                uxLog.AppendText(text + "\r\n");
            }
        }
        private void OnApplicationExit(object sender, EventArgs e)
        {
            _ocr.Stop();
        }

        private void OnOcrProcessComplete(string info)
        {
            if (uxCapture.InvokeRequired)
            {
                uxCapture.Invoke(new Action(() => uxCapture.Enabled = true));
            }
            else
            {
                uxCapture.Enabled = true;
            }
            LogText(info);
        }

        private void uxBrowse_Click(object sender, EventArgs e)
        {
            if(uxSaveFileDialog.ShowDialog() == DialogResult.OK)
            {
                uxFilename.Text = uxSaveFileDialog.FileName;
            }

            if(uxFilename.Text.Length > 0)
            {
                uxCapture.Enabled = true;
            }
            else
            {
                uxCapture.Enabled = false;
            }
        }

        private void uxCapture_Click(object sender, EventArgs e)
        {
            uxCapture.Enabled = false;

            var screenshot = ScreenshotUtils.PrintWindow();
            if (screenshot == null)
            {
                LogText("Could not find game window");
                return;
            }

            var filename = Path.Combine(Path.GetDirectoryName(Application.ExecutablePath), "screenshot.jpg");

            screenshot.Bitmap.Save(filename, ImageFormat.Jpeg);

            _ocr.Process(filename);
        }
    }
}
