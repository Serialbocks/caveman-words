
namespace caveman_ocr
{
    partial class uxMainWindow
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.uxCapture = new System.Windows.Forms.Button();
            this.uxFilename = new System.Windows.Forms.TextBox();
            this.uxFilenameLabel = new System.Windows.Forms.Label();
            this.uxBrowse = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // uxCapture
            // 
            this.uxCapture.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.uxCapture.Enabled = false;
            this.uxCapture.Location = new System.Drawing.Point(12, 153);
            this.uxCapture.Name = "uxCapture";
            this.uxCapture.Size = new System.Drawing.Size(281, 56);
            this.uxCapture.TabIndex = 0;
            this.uxCapture.Text = "Capture";
            this.uxCapture.UseVisualStyleBackColor = true;
            // 
            // uxFilename
            // 
            this.uxFilename.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.uxFilename.Location = new System.Drawing.Point(90, 33);
            this.uxFilename.Name = "uxFilename";
            this.uxFilename.Size = new System.Drawing.Size(122, 23);
            this.uxFilename.TabIndex = 1;
            this.uxFilename.TabStop = false;
            // 
            // uxFilenameLabel
            // 
            this.uxFilenameLabel.AutoSize = true;
            this.uxFilenameLabel.Location = new System.Drawing.Point(12, 36);
            this.uxFilenameLabel.Name = "uxFilenameLabel";
            this.uxFilenameLabel.Size = new System.Drawing.Size(72, 15);
            this.uxFilenameLabel.TabIndex = 2;
            this.uxFilenameLabel.Text = "CSV Output:";
            // 
            // uxBrowse
            // 
            this.uxBrowse.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.uxBrowse.Location = new System.Drawing.Point(218, 32);
            this.uxBrowse.Name = "uxBrowse";
            this.uxBrowse.Size = new System.Drawing.Size(75, 23);
            this.uxBrowse.TabIndex = 3;
            this.uxBrowse.Text = "Browse";
            this.uxBrowse.UseVisualStyleBackColor = true;
            // 
            // textBox1
            // 
            this.textBox1.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.textBox1.Location = new System.Drawing.Point(12, 61);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.ReadOnly = true;
            this.textBox1.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.textBox1.Size = new System.Drawing.Size(281, 81);
            this.textBox1.TabIndex = 4;
            this.textBox1.TabStop = false;
            // 
            // uxMainWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(305, 221);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.uxBrowse);
            this.Controls.Add(this.uxFilenameLabel);
            this.Controls.Add(this.uxFilename);
            this.Controls.Add(this.uxCapture);
            this.MinimumSize = new System.Drawing.Size(321, 260);
            this.Name = "uxMainWindow";
            this.Text = "Caveman Capture";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button uxCapture;
        private System.Windows.Forms.TextBox uxFilename;
        private System.Windows.Forms.Label uxFilenameLabel;
        private System.Windows.Forms.Button uxBrowse;
        private System.Windows.Forms.TextBox textBox1;
    }
}

