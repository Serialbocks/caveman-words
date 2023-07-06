
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
            this.uxLog = new System.Windows.Forms.TextBox();
            this.uxSaveFileDialog = new System.Windows.Forms.SaveFileDialog();
            this.uxRetry = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // uxCapture
            // 
            this.uxCapture.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.uxCapture.Enabled = false;
            this.uxCapture.Location = new System.Drawing.Point(12, 297);
            this.uxCapture.Name = "uxCapture";
            this.uxCapture.Size = new System.Drawing.Size(499, 56);
            this.uxCapture.TabIndex = 0;
            this.uxCapture.Text = "Capture";
            this.uxCapture.UseVisualStyleBackColor = true;
            this.uxCapture.Click += new System.EventHandler(this.uxCapture_Click);
            // 
            // uxFilename
            // 
            this.uxFilename.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.uxFilename.BackColor = System.Drawing.SystemColors.Window;
            this.uxFilename.Location = new System.Drawing.Point(90, 33);
            this.uxFilename.Name = "uxFilename";
            this.uxFilename.ReadOnly = true;
            this.uxFilename.Size = new System.Drawing.Size(340, 23);
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
            this.uxBrowse.Location = new System.Drawing.Point(436, 32);
            this.uxBrowse.Name = "uxBrowse";
            this.uxBrowse.Size = new System.Drawing.Size(75, 23);
            this.uxBrowse.TabIndex = 3;
            this.uxBrowse.Text = "Browse";
            this.uxBrowse.UseVisualStyleBackColor = true;
            this.uxBrowse.Click += new System.EventHandler(this.uxBrowse_Click);
            // 
            // uxLog
            // 
            this.uxLog.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.uxLog.BackColor = System.Drawing.SystemColors.Window;
            this.uxLog.Location = new System.Drawing.Point(12, 61);
            this.uxLog.Multiline = true;
            this.uxLog.Name = "uxLog";
            this.uxLog.ReadOnly = true;
            this.uxLog.ScrollBars = System.Windows.Forms.ScrollBars.Vertical;
            this.uxLog.Size = new System.Drawing.Size(499, 178);
            this.uxLog.TabIndex = 4;
            this.uxLog.TabStop = false;
            // 
            // uxSaveFileDialog
            // 
            this.uxSaveFileDialog.Filter = "CSV Files (*.csv)|*.csv";
            // 
            // uxRetry
            // 
            this.uxRetry.Location = new System.Drawing.Point(166, 245);
            this.uxRetry.Name = "uxRetry";
            this.uxRetry.Size = new System.Drawing.Size(192, 46);
            this.uxRetry.TabIndex = 5;
            this.uxRetry.Text = "Retry";
            this.uxRetry.UseVisualStyleBackColor = true;
            this.uxRetry.Click += new System.EventHandler(this.uxRetry_Click);
            // 
            // uxMainWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(523, 365);
            this.Controls.Add(this.uxRetry);
            this.Controls.Add(this.uxLog);
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
        private System.Windows.Forms.TextBox uxLog;
        private System.Windows.Forms.SaveFileDialog uxSaveFileDialog;
        private System.Windows.Forms.Button uxRetry;
    }
}

